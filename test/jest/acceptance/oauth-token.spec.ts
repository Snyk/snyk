import {
  chdirWorkspaces,
  getWorkspaceJSON,
} from '../../acceptance/workspace-helper';
import { fakeServer } from '../../acceptance/fake-server';
import cli = require('../../../src/cli/commands');
import { chdir } from 'process';
// TODO: test changes config, but config is static and generated on require
// to make this work we need a mock on config, reload mechanism on config or run CLI in another process
describe.skip('test using OAuth token', () => {
  let oldkey: string;
  let oldendpoint: string;
  const apiKey = '123456789';
  const port: string = process.env.PORT || process.env.SNYK_PORT || '12345';

  const BASE_API = '/api/v1';

  const server = fakeServer(BASE_API, apiKey);

  const noVulnsResult = getWorkspaceJSON(
    'fail-on',
    'no-vulns',
    'vulns-result.json',
  );

  let origCwd: string;

  beforeAll(async () => {
    origCwd = process.cwd();
    process.env.SNYK_API = `http://localhost:${port}${BASE_API}`;
    process.env.SNYK_HOST = `http://localhost:${port}`;

    let key = await cli.config('get', 'api');
    oldkey = key;

    key = await cli.config('get', 'endpoint');
    oldendpoint = key;

    await new Promise((resolve) => {
      server.listen(port, resolve);
    });
  });

  afterAll(async () => {
    delete process.env.SNYK_API;
    delete process.env.SNYK_HOST;
    delete process.env.SNYK_PORT;
    delete process.env.SNYK_OAUTH_TOKEN;

    await server.close();

    if (oldkey) {
      await cli.config('set', 'api=' + oldkey);
    } else {
      await cli.config('unset', 'api');
    }

    if (oldendpoint) {
      await cli.config('set', 'endpoint=' + oldendpoint);
    }
    chdir(origCwd);
  });

  it('successfully tests a project with an OAuth env variable set', async () => {
    process.env.SNYK_OAUTH_TOKEN = 'oauth-jwt-token';

    server.setNextResponse(noVulnsResult);
    chdirWorkspaces('fail-on');
    await cli.test('no-vulns', {
      json: true,
      _doubleDashArgs: [],
      _: [],
    });
    const req = server.popRequest();
    expect(req.headers.authorization).toBe('Bearer oauth-jwt-token');
    expect(req.method).toBe('POST');
  });

  it('successfully monitors a project with an OAuth env variable set', async () => {
    process.env.SNYK_OAUTH_TOKEN = 'oauth-jwt-token';

    server.setNextResponse(noVulnsResult);
    chdirWorkspaces('fail-on');
    await cli.monitor('no-vulns', {
      json: true,
      _doubleDashArgs: [],
      _: [],
    });
    const req = server.popRequest();
    expect(req.headers.authorization).toBe('Bearer oauth-jwt-token');
    expect(req.method).toBe('PUT');
  });
});
