import {generateService} from "@umijs/openapi";

generateService({
    requestLibPath: "import request from '@/request'",
    schemaPath: "http://172.20.112.1:8080/api/v3/api-docs",
    serversPath: "./src"
})