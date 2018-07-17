#!/bin/sh
echo "current pwd:" $(pwd)
list=`ls -1 ./app/*.zip`
echo $list
version=`grep "version" ../package.json | awk -F '"' '{print $4}'`
auth=${GIT_USERNAME}:${GH_TOKEN}

echo 'create release...'

release=`curl -u $auth \
  --url 'https://api.github.com/repos/TRPGEngine/Client/releases' \
  --request POST \
  --header 'Content-Type: application/json' \
  --data '{
    "tag_name": "v'${version}'",
    "target_commitish": "release",
    "name": "v'${version}'",
    "body": "",
    "draft": true,
    "prerelease": true
  }'`
echo $release
release_id=`echo $release | awk -F '"id"' '{print $2}' | awk '{print $2}' | sed 's/[^0-9]//g'`
echo "release_id: ${release_id}"
if [ ! -n "$release_id" ] ;then
  echo 'release_id 不存在'
  exit 2
fi

echo 'create release completed!'

echo 'try upload zip file...'
for f in $list
do
  echo "start upload file: $f"
  filename=`echo $f | awk -F '/' '{print $NF}'`
  upload=`curl -u $auth \
    --header 'Content-Type: application/zip' \
    --url "https://api.github.com/repos/TRPGEngine/Client/releases/${release_id}/assets?name=${filename}" \
    --data @$f`
  echo "upload file $f completed!"
done

echo 'upload all zip file completed!'
