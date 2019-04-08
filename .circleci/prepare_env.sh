#!/bin/bash -xe
# -*- coding: utf-8 -*-
# for circle ci

case "$OSTYPE" in
  "linux-gnu")
    # Not using Trusty containers because it can't install wine1.6(-i386),
    # see: https://github.com/travis-ci/travis-ci/issues/6460
    sudo apt-key adv --fetch-keys http://dl.yarnpkg.com/debian/pubkey.gpg
    echo "deb http://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
    sudo dpkg --add-architecture i386
    sudo apt-get update
    sudo apt-get install -y wine yarn
    ;;
esac
