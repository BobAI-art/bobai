#!/usr/bin/env bash

# remove old model-trainer images
aws ec2 describe-images --owners self  | jq '.Images[] | "\(.Name):\(.ImageId)"' -r | sort | grep model-trainer | sed '1d' | cut -d":" -f2  |  tr '\n' '\0' |  xargs -0 -n1 aws ec2 deregister-image --image-id

IMAGE=$(aws ec2 describe-images --owners self  | jq '.Images[] | "\(.ImageId)"' -r)

if [[ $(echo "$IMAGE" | wc -l) -eq 1 ]]; then
    # cleanup snapshots
    echo "Current image: ${IMAGE}"
    SNAPSHOTS=$(aws ec2 describe-snapshots --owner-ids self | jq '.Snapshots[] | "\(.Description):\(.SnapshotId)"' -r | grep CreateImage)
    echo "${SNAPSHOTS}" | grep -v "$IMAGE" | cut -d":" -f2 | tr '\n' '\0'  | xargs -0 -n1 aws ec2 delete-snapshot --snapshot-id
else
    echo "More than one image left"
    exit 1
fi

