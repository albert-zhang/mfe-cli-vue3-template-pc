#!/bin/bash

npm install --unsafe-perm
npm run build

# Note: Execute Shell in jenkins job only need to config as:
#
# cd ${WORKSPACE} && export PATH=/var/jenkins_home/node8/bin:$PATH
# /bin/bash build.sh
