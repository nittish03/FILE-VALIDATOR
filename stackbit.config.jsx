import { defineStackbitConfig } from '@stackbit/types';

const stackbitConfig = defineStackbitConfig({
    stackbitVersion: "~0.6.0",
    nodeVersion: "18",
    ssgName: "custom",
    contentSources: [],
    postInstallCommand: "npm i --no-save @stackbit/types"
});

export default stackbitConfig;
