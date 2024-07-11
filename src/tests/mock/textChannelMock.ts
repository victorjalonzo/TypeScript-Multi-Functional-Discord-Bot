// tests/mocks/TextChannelMock.ts
import { TextChannel, ChannelType, Guild, CategoryChannel, PermissionOverwriteManager, GuildMessageManager, GuildMember, Message, ThreadChannel, GuildTextThreadManager, AllowedThreadTypeForTextChannel, Collection, Snowflake } from 'discord.js';
import { MockProxy, mock} from 'vitest-mock-extended';
import { createRandomId } from '../../shared/utils/generate.js';

export function createMockTextChannel(): MockProxy<TextChannel> {
  const mockGuild = mock<Guild>();
  mockGuild.id = createRandomId();
  mockGuild.name = 'Test Guild';

  const mockCategory = mock<CategoryChannel>();
  mockCategory.id = createRandomId();
  mockCategory.name = 'Test Category';

  const mockPermissionOverwrites = mock<PermissionOverwriteManager>();
  
  const mockThreads = mock<GuildTextThreadManager<AllowedThreadTypeForTextChannel>>();
  mockThreads.create.mockResolvedValue(mock<ThreadChannel>());

  const mockTextChannel = mock<TextChannel>();
  mockTextChannel.id = createRandomId();
  mockTextChannel.name = 'Test Channel';
  mockTextChannel.guild = mockGuild;
  mockTextChannel.type = ChannelType.GuildText
  mockTextChannel.permissionOverwrites = mockPermissionOverwrites;
  mockTextChannel.nsfw = false;
  mockTextChannel.topic = 'General discussion';
  mockTextChannel.lastMessageId = '2345678901';
  mockTextChannel.rateLimitPerUser = 0;
  mockTextChannel.defaultAutoArchiveDuration = 60;
  mockTextChannel.lastPinTimestamp = Date.now();
  mockTextChannel.threads = mockThreads;

  Object.defineProperties(mockTextChannel, {
    'position': {
      value: 0,
      writable: false
    },
    'guildId': {
      get: () => mockGuild?.id
    },
    'parent': {
      value: mockCategory,
      writable: false
    },
    'parentId': {
      get: () => mockCategory?.id
    },
    'createdAt': {
      value: new Date(),
      writable: false
    },
    'createdTimestamp': {
      value: Date.now(),
      writable: false
    },
    'lastPinTimestamp': {
      value: Date.now(),
      writable: false
    },
    'members': {
      value: new Collection<Snowflake, GuildMember>(),
      writable: false
    }
  })

  return mockTextChannel;
}
