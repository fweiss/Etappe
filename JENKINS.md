# Jenkins
For continuous integration, this project can be tested on Jenkins.

Jenkins can be run locally, in a VM, and in the cloud. This exercise used a bitnami 
image running in a local VirtualBox VM.

## Setup Jenkins in local VM
The follow steps are needed to get up and running:

- install Oracle VirtualBox
- download the bitnami jenkins .ova
- create a vm instance from the .ova
- install Google Chrome Browser on the VM instance
- create and configure a Jenkins job
- run the job

### Download the bitnami jenkins
This page has links: https://bitnami.com/stack/jenkins

### Google Chrome
Google Chrome can be installed manually as follows:

- login to the VM instance
- get the latest stable package: ``wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb``
- install it ``sudo apt install ./google-chrome-stable_current_amd64.deb``
- verify the it's installed ``ls -l /usr/bin/google-chrome``

### Create and configure a jenkins job
After creating a new job, the following configuration:

- Source code management, git, ``https://github.com/fweiss/Etappe.git``
- under "Build Environment": Select the option "Provide Node & npm bin/ folder to PATH"
- for "Cache location", select the option "Local to the workspace"
- create a shell step ``npm install``
- create a shell step ``CHROME_BIN=/usr/bin/google-chrome npm test``

### Run the job
Click the "Build now" link.

TODO configure a report, add coverage report

