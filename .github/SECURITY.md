# Security Policy

## Supported Versions

The following versions of scorm-again are currently being supported with security updates:

| Version | Supported          |
|---------| ------------------ |
| 3.x.x   | :white_check_mark: |
| 2.6.x   | :white_check_mark: |
| < 2.6.0 | :x:                |

## Reporting a Vulnerability

We take the security of scorm-again seriously. If you believe you've found a security vulnerability, please follow these steps:

1. **Do not disclose the vulnerability publicly** - Please do not create a public GitHub issue for security vulnerabilities.
2. **Email the maintainer directly** - Send details of the vulnerability to [scorm-again@putney.io](mailto:scorm-again@putney.io).
3. **Include details** - Please provide as much information as possible, including:
   - A description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if available)

## Response Process

Here's what you can expect after reporting a vulnerability:

1. **Acknowledgment** - You will receive an acknowledgment of your report within 48 hours.
2. **Verification** - We will verify the vulnerability and determine its impact.
3. **Fix Development** - If the vulnerability is accepted, we will develop a fix.
4. **Release Planning** - We will determine an appropriate release schedule based on severity.
5. **Public Disclosure** - Once a fix is released, the vulnerability will be publicly disclosed in the release notes.

## Disclosure Policy

- Security vulnerabilities will be disclosed after a fix has been released
- Credit will be given to the reporter (unless anonymity is requested)
- Public disclosure will include details about the vulnerability, its impact, and how to update

## Security Best Practices

When implementing scorm-again in your projects, please follow these security best practices:

- Always validate data coming from external sources before passing it to the API
- Be cautious with the content of `suspend_data` as it may contain sensitive information
- Use HTTPS for all LMS communications to prevent data interception
- Review the `xhrHeaders` and `responseHandler` settings for potential security implications
- Load SCORM content in a sandboxed iframe for security reasons

## Acknowledgments

We would like to thank the following individuals for responsibly disclosing security vulnerabilities:

*No security vulnerabilities have been reported yet.*
