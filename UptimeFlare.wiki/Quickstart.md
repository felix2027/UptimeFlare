#### Prerequisite
- Your Cloudflare account (free plan is enough, no credit card required)
- Your GitHub account to run Actions to deploy

#### Setup steps

To setup your own Uptimeflare on Cloudflare:

1. Create an API Token at https://dash.cloudflare.com/profile/api-tokens, using `Edit Cloudflare Workers` template.

   ![Creating Cloudflare API Token](https://github.com/lyc8503/UptimeFlare/assets/36782264/a4e2ba57-6cae-49c0-a82a-e6dd0a141505)

2. Create a copy of [this repo](https://github.com/lyc8503/UptimeFlare) in your account via clicking `Use this template`. Optionally make it private if you don't want others to see your monitor definitions. (You may directly include token there).

   ![Create your own repo](https://github.com/lyc8503/UptimeFlare/assets/36782264/424d7be4-fec9-4c62-8efe-2ba486084111)

3. Set your Cloudflare API Token in `Settings - Secrets and variables - Actions`, set a secret whose key is `CLOUDFLARE_API_TOKEN` and value is the token you obtained in Step 1. Your token will be stored securely by GitHub.

   ![Set token](https://github.com/lyc8503/UptimeFlare/assets/36782264/3e5e23a9-8163-49fb-9acf-530174cdd107)

4. Edit the `uptime.config.ts` file (located at the root of YOUR OWN repo) to define your monitors and customize your status page, refer to [the docs](https://github.com/lyc8503/UptimeFlare/wiki/Configuration) for a more detailed explanation.

   After editing, Navigate to `Actions` to see the progress of deployment. When the pipeline succeeds, you should see the status page deployed successfully in your Cloudflare account at `Workers & Pages`.

   ![Cloudflare Dashboard](https://github.com/lyc8503/UptimeFlare/assets/36782264/3ef1b03b-1238-4be7-9438-bd6f95f25162)

5. To update or modify your config later, just edit `uptime.config.ts` again. If your configuration is correct, the pipeline will pick up your changes and apply them to your Cloudflare Pages automatically.
