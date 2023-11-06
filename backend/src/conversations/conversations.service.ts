/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConversationsService {
    constructor() {}

    async getConversation(convId: number) {
        return `This action returns a #${convId} conversation`;
    }
}

