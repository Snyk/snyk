# @snyk/protect -- Patch vulnerable code in your project's dependencies.

## USAGE

You don't typically need to add the @snyk/protect dependency manually. It'll be introduced when it's needed as part of Snyk's Fix PR service: https://support.snyk.io/hc/en-us/articles/360011484018-Fixing-vulnerabilities).

To enable patches in your Fix PRs:

- Visit https://app.snyk.io
- Go to "Org Settings" > "Integrations"
- Choose "Edit Settings" under your SCM integration.
- Under the "Fix Pull Request" section, ensure patches are enabled.
  Snyk will now include patches as part of its Fix PRs for your project.

## FOR MORE INFORMATION

Visit Snyk Protect GitHub repository: https://github.com/snyk/snyk/tree/master/packages/snyk-protect.
