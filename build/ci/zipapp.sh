#!/bin/sh
echo "current pwd:" $(pwd)
list=`ls -l ./app | grep ^d | awk '{print $9}'`
echo $list
echo 'zip app file...'
for file in $list
do
  absPath=$(pwd)"/app/"$file
  echo "zip $absPath ..."
  zip -r $absPath".zip" './app/'$file'/'
done
echo 'zip app completed!'
