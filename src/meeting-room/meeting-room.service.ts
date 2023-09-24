import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMeetingRoomDto } from './dto/create-meeting-room.dto';
import { UpdateMeetingRoomDto } from './dto/update-meeting-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MeetingRoom } from './entities/meeting-room.entity';
import { Like, Repository } from 'typeorm';

@Injectable()
export class MeetingRoomService {
  @InjectRepository(MeetingRoom)
  private repository: Repository<MeetingRoom>;

  // 初始化数据
  initData() {
    const room1 = new MeetingRoom();
    room1.name = '木星';
    room1.capacity = 10;
    room1.equipment = '白板';
    room1.location = '一层西';

    const room2 = new MeetingRoom();
    room2.name = '金星';
    room2.capacity = 5;
    room2.equipment = '';
    room2.location = '二层东';

    const room3 = new MeetingRoom();
    room3.name = '天王星';
    room3.capacity = 30;
    room3.equipment = '白板，电视';
    room3.location = '三层东';

    // 确认是设置时候 可使用insert 代替save
    this.repository.insert([room1, room2, room3]);
  }

  // 查询数据
  async find(
    pageNo: number,
    pageSize: number,
    name: string,
    capacity: string,
    equipment: string,
  ) {
    if (pageNo < 1) {
      throw new BadRequestException('页码最小为1');
    }

    const condition: Record<string, any> = {};
    // 查询条件 start
    if (name) condition.name = Like(`%${name}%`);
    if (equipment) condition.equipment = Like(`%${equipment}%`);
    if (capacity) condition.capacity = Like(`%${capacity}%`);
    // 查询条件 end

    const skipCount = (pageNo - 1) * pageSize;
    const [MeetingRooms, totalCount] = await this.repository.findAndCount({
      skip: skipCount,
      take: pageSize,
      where: condition,
    });

    return {
      MeetingRooms,
      totalCount,
    };
  }

  // 创建房间
  async create(meetingRoomDto: CreateMeetingRoomDto) {
    const room = await this.repository.findOneBy({
      name: meetingRoomDto.name,
    });

    if (room) {
      throw new BadRequestException('会议室已存在');
    }

    return await this.repository.insert(meetingRoomDto);
  }

  // 更新会议室房间
  async update(meetingRoomDto: UpdateMeetingRoomDto) {
    const room = await this.repository.findOneBy({
      id: meetingRoomDto.id,
    });

    if (!room) {
      throw new BadRequestException('会议室不已存在');
    }

    room.capacity = meetingRoomDto.capacity;
    room.location = meetingRoomDto.location;
    room.name = meetingRoomDto.name;
    if (room.description) room.description = meetingRoomDto.description;
    if (room.equipment) room.equipment = meetingRoomDto.equipment;

    await this.repository.update(
      {
        id: room.id,
      },
      room,
    );
    return 'success';
  }

  // 查询单条数据
  async findById(id: number) {
    return this.repository.findOneBy({
      id,
    });
  }

  // 删除指定房间
  async delete(id: number) {
    await this.repository.delete({
      id,
    });
    return 'success';
  }
}
