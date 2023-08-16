import { BadRequestException, ParseIntPipe } from '@nestjs/common';

// 入参异常提示封装
export const generateParseIntPipe = (name: string) => {
  return new ParseIntPipe({
    exceptionFactory() {
      throw new BadRequestException(`${name} 应该传数字`);
    },
  });
};
