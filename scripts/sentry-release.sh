#!/bin/bash

# Assumes you're in a git repository
export SENTRY_ORG=pooltogether

if [[ -z "$NEXT_JS_RELEASE_VERSION" ]]; then
    echo "Must provide NEXT_JS_RELEASE_VERSION in environment" 1>&2
    exit 1
fi

# Create a release
sentry-cli releases new $NEXT_JS_RELEASE_VERSION

# Upload the source maps
sentry-cli releases files $NEXT_JS_RELEASE_VERSION upload-sourcemaps out

# Associate commits with the release
sentry-cli releases set-commits $NEXT_JS_RELEASE_VERSION --commit "$SENTRY_REPO_NAME@$COMMIT_REF"

# Finalize the release
sentry-cli releases finalize $NEXT_JS_RELEASE_VERSION