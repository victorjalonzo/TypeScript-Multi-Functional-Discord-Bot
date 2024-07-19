import { 
    Guild, 
    GuildMemberManager, 
    RoleManager, 
    ChannelManager, 
    //EmojiManager, 
    PresenceManager, 
    VoiceStateManager, 
    GuildScheduledEventManager, 
    GuildBanManager, 
    GuildApplicationCommandManager, 
    //IntegrationManager, 
    //InviteManager, 
    GuildStickerManager, 
    GuildAuditLogs, 
    Collection, 
    Snowflake, 
    GuildFeature, 
    GuildMember, 
    Role 
  } from 'discord.js';
  
  import { MockProxy, mock } from 'vitest-mock-extended';
  import { createRandomId } from '../../shared/utils/generate.js';
  
  export function createMockGuild(): MockProxy<Guild> {
    const mockGuild = mock<Guild>();
  
    mockGuild.id = createRandomId();
    mockGuild.name = 'Test Guild';
    mockGuild.icon = 'https://example.com/icon.png';
    mockGuild.splash = 'https://example.com/splash.png';
    mockGuild.banner = 'https://example.com/banner.png';
    //mockGuild.region = 'us-west';
    mockGuild.afkTimeout = 300;
    mockGuild.systemChannelId = createRandomId();
    mockGuild.rulesChannelId = createRandomId();
    mockGuild.publicUpdatesChannelId = createRandomId();
    //mockGuild.preferredLocale = 'en-US';
    mockGuild.ownerId = createRandomId();
  
    const mockMembers = mock<GuildMemberManager>();
    mockGuild.members = mockMembers;
  
    const mockRoles = mock<RoleManager>();
    mockGuild.roles = mockRoles;
  
    const mockChannels = mock<ChannelManager>();
    //mockGuild.channels = mockChannels;
  
    //const mockEmojis = mock<EmojiManager>();
    //mockGuild.emojis = mockEmojis;
  
    const mockPresences = mock<PresenceManager>();
    mockGuild.presences = mockPresences;
  
    const mockVoiceStates = mock<VoiceStateManager>();
    mockGuild.voiceStates = mockVoiceStates;
  
    const mockScheduledEvents = mock<GuildScheduledEventManager>();
    mockGuild.scheduledEvents = mockScheduledEvents;
  
    const mockBans = mock<GuildBanManager>();
    mockGuild.bans = mockBans;
  
    const mockCommands = mock<GuildApplicationCommandManager>();
    mockGuild.commands = mockCommands;
  
    //const mockIntegrations = mock<IntegrationManager>();
    //mockGuild.integrations = mockIntegrations;
  
    //const mockInvites = mock<InviteManager>();
    //mockGuild.invites = mockInvites;
  
    const mockStickers = mock<GuildStickerManager>();
    mockGuild.stickers = mockStickers;
  
    Object.defineProperties(mockGuild, {
      'createdAt': {
        value: new Date(),
        writable: false
      },
      'createdTimestamp': {
        value: Date.now(),
        writable: false
      },
      'features': {
        value: new Set<GuildFeature>(),
        writable: false
      },
      'memberCount': {
        value: 10,
        writable: false
      },
      'large': {
        value: false,
        writable: false
      },
      'maximumMembers': {
        value: 250000,
        writable: false
      },
      'maximumPresences': {
        value: 25000,
        writable: false
      },
      'vanityURLCode': {
        value: 'test',
        writable: false
      },
      'description': {
        value: 'A test guild',
        writable: false
      },
      'verificationLevel': {
        value: 1,
        writable: false
      },
      'nsfwLevel': {
        value: 0,
        writable: false
      },
      'premiumTier': {
        value: 0,
        writable: false
      },
      'premiumSubscriptionCount': {
        value: 0,
        writable: false
      },
      'defaultMessageNotifications': {
        value: 'ALL',
        writable: false
      },
      'mfaLevel': {
        value: 1,
        writable: false
      }
    });
  
    return mockGuild;
  }