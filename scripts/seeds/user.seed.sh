#!/bin/bash
CT="Content-Type:application/json"
REQ="curl -i -H$CT -X GET http://localhost:3000/api/seeds/pilots/10"
echo $REQ
RESPONSE=`$REQ`
echo $RESPONSE
