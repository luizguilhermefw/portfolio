import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import type { Response } from 'express';
import { Prisma } from '../generated/prisma/client.js';

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(error: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    if (error instanceof HttpException) {
      const body = error.getResponse();
      response.status(error.getStatus()).json(
        typeof body === 'string' ? { statusCode: error.getStatus(), message: body } : body,
      );
      return;
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        response.status(409).json({ statusCode: 409, message: 'Registro único já existente' });
        return;
      }
      if (error.code === 'P2025') {
        response.status(404).json({ statusCode: 404, message: 'Registro não encontrado' });
        return;
      }
      if (error.code === 'P2003') {
        response.status(400).json({ statusCode: 400, message: 'Referência inválida' });
        return;
      }
    }
    response.status(500).json({ statusCode: 500, message: 'Erro interno do servidor' });
  }
}
