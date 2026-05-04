import type { JitsiCredentials } from './api';

/** Build the JitsiMeeting prop set for a given set of credentials. */
export function buildJitsiConfig(creds: JitsiCredentials, opts: { displayName: string; email: string }) {
  const teacherToolbar = [
    'microphone', 'camera', 'screenshare', 'tileview', 'chat',
    'raisehand', 'participants-pane', 'settings', 'mute-everyone', 'security', 'hangup',
  ];
  const studentToolbar = [
    'microphone', 'camera', 'tileview', 'chat', 'raisehand', 'settings', 'hangup',
  ];

  return {
    domain: creds.domain,
    roomName: creds.room,
    userInfo: {
      displayName: opts.displayName,
      email: opts.email,
    },
    configOverwrite: {
      prejoinPageEnabled: false,
      startWithAudioMuted: !creds.isModerator,
      startWithVideoMuted: !creds.isModerator,
      disableDeepLinking: true,
      enableClosePage: false,
      hideConferenceSubject: true,
      // Disable Jitsi's chat for students; we use our own side rail
      // (kept available for moderator if useful).
      disableInviteFunctions: true,
      readOnlyName: true,
      toolbarButtons: creds.isModerator ? teacherToolbar : studentToolbar,
    },
    interfaceConfigOverwrite: {
      MOBILE_APP_PROMO: false,
      SHOW_JITSI_WATERMARK: false,
      DISABLE_VIDEO_BACKGROUND: false,
      DEFAULT_BACKGROUND: '#0b0f17',
    },
  };
}
