import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { UserService } from './users/users.service';
import { UserAdminCreateDTO, UserCreateDTO } from './users/models/User';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.enableCors({
    credentials: true, // Allow credentials (e.g., cookies)
    allowedHeaders: '*',
  });
  const configService = app.get(ConfigService);
  const port = configService.get('PORT')
  const config = new DocumentBuilder().build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(port);

  const userService = app.get(UserService);
  try{
    const admin = new UserAdminCreateDTO()
    admin.blocked = false;
    admin.date_registered = new Date()
    admin.isAdmin = true;
    admin.password = "admin"
    admin.username = "admin"
    admin.valid_since = new Date()

    await userService.register(admin)
  }catch(e){
    console.log(e)
  }
  
}
bootstrap();
