import {ConfigService} from "@nestjs/config";
import { MongooseModuleFactoryOptions } from "@nestjs/mongoose";

export const getMongoConfig = async (configService: ConfigService): Promise<MongooseModuleFactoryOptions> => {
    return {
        uri: getMongoURI(configService),
        ...getMongoOptions(),
    }
}
const getMongoURI = (configService: ConfigService) => {
    return 'mongodb+srv://' +
        configService.get('MONGO_USERNAME') +
        ':' +
        configService.get('MONGO_PASSWORD') +
        '@' +
        (configService.get('MONGO_HOST'))


}
const getMongoOptions = (): Omit<MongooseModuleFactoryOptions, 'uri'> => ({
})