This project will be updated from time to time with new features, so if you wish to update your own deployment, here are three ways to do it. (You just need to choose one of them!)

**NOTE**: UptimeFlare is still a new program that is growing and evolving rapidly, and after upgrading, you may need to **manually update your configuration files** in order for the monitor to continue to function properly. Historical monitoring data will be retained without manual intervention.

1. **[Recommended]** Only for users who started after **2024/6/30** or have manually updated since then
   
   As shown below, go to `Actions` - `Upstream Sync` - `Run workflow` in your own repository.
   
   ![upgrade](https://github.com/lyc8503/UptimeFlare/assets/36782264/d2ce29e3-cd98-4bac-8086-288f70a71ace)

   This should trigger an automatic update. After waiting for a short while (less than 30s), refresh the page and you can see the newly triggered task with its execution result. If a green checkmark is displayed, it means that the code has been updated successfully.

   If there is a problem with the update (Actions run with a red cross), click on the corresponding entry to see the detailed error log:

   1. `nothing to commit, working tree clean`: This means you're already on the latest version and don't need to update!

   2. `refusing to allow a GitHub App to create or update workflow .github/workflows/xxx.yaml without workflows permission`: This means that the workflow file for this repository has been updated, which is normal and can sometimes happen. In this case, Actions can't update itself without a token, you need to manually create a token [here](https://github.com/settings/tokens?type=beta) with **Workflows** and **Contents** permissions, put it into the input box in the figure above when you try again. After a successful update, you can safely delete the token that is no longer needed.
   
   If an error occurs with the deployment after the update, you may need to check the latest documentation to see if the configuration file has changed.

---

2. **[Not Recommended]** Use Git on your computer to pull my repository (upstream) and merge it into your own. Refer to: https://stackoverflow.com/questions/56577184/github-pull-changes-from-a-template-repository

3. **[Not Recommended]** Backup your current `uptime.config.ts`, delete your current repository, recreate the repository from the template, set the environment variables (`CLOUDFLARE_API_TOKEN`), restore the config file and you're done!
