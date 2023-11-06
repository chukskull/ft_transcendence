/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConversationService {
    constructor() {}

    async getConversation(convId: number) {
        return `This action returns a #${convId} conversation`;
    }
}

