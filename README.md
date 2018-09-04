# Smart home error reporting utility
This sample shows how to integrate [Stackdriver](https://cloud.google.com/stackdriver/) with your
smart home service in order to process and triage errors that originate when your service sends
an invalid response to the Google Assistant.

In this sample, you are able to simulate many common errors that may be in a smart home response.
You can view these errors in graphs and reports.

## Setup
### Setup project
1. Follow the instructions to [set up and initialize the Firebase SDK](https://firebase.google.com/docs/functions/get-started#set_up_and_initialize_functions_sdk)
    * Setup **Cloud Functions**, **Hosting**, and **Firestore**

### Setup sample code
1. `cd functions && yarn && cd ..`
1. `cd public && yarn`
1. `yarn firebase-setup`
1. `yarn build`
1. Run `firebase deploy` and take note of the hosting URL. It should look like:
    `<project-id>.firebaseapp.com`

### Domain Verification
1. Open the Google Cloud Console and go to [APIs & Services](https://console.cloud.google.com/apis/credentials)
    1. Under **Credentials > Domain Verification** add your domain.
    1. After adding your domain you will be taken to the Google Search console. Follow the instructions there
    to finish verifying your website before proceeding.
    1. You will download a verification webpage. Add this file to the `public` directory.

1. Run `firebase deploy` to upload this new verification file

### Google Cloud Pub/Sub
To start exporting your errors, go to [**Logging > Logs**](https://console.cloud.google.com/logs/viewer)

1. Create a new **Export**
    1. Give it a name like _smarthome-error_
    1. Select _Cloud Pub/Sub_ as the Sink Service
    1. Create a new Cloud Pub/Sub topic
1. Go to [**Logging > Exports**](https://console.cloud.google.com/logs/exports), find the export you just created, and select **Edit sink**
    1. Update the filter for your service to be:

```
severity>=ERROR
("SYNC")
```

1. Click **Update Sink** and replace your existing sink.
1. Go to [**Pub/Sub > Topics**](https://console.cloud.google.com/cloudpubsub/topicList)
    1. You'll see your topic has already been created.
    1. Select your topic and create a new subscription
    1. Give your subscription a name
    1. Choose the **Push** delivery type and enter the endpoint:
    `<project-id>.firebaseapp.com/alerts/stackdriver`
    1. Select **Save**

Now you are ready to triage errors to your server.

1. Open `<project-id>.firebaseapp.com` in a web browser
    1. You can use the dropdowns to change the validity of certain parameters
    1. You can use the **SYNC** button to generate invalid responses
    1. You'll see these errors get displayed on the page
    1. Your function will also be executed with the error from Stackdriver
    1. The Firestore instance will be updated, and you'll see the graphs change