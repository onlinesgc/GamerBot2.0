const mh = require("../src/message_handler");

let mockedSend;
let mockedReact;
let mockedMentionHas;
let mockedMentions;

let message = {};
let client = {};
let clientUser = 'client-user';

beforeEach(() => {
  mockedSend = jest.fn(msg => msg);
  mockedReact = jest.fn(msg => msg);
  mockedMentionHas = jest.fn(data => mockedMentions.includes(data));
  mockedMentions = [];

  message = {
    content: "Test message",
    react: mockedReact,
    channel: {
      send: mockedSend,
      id: 12345,
    },
    author: {
      bot: false,
    },
    mentions: {
      has: mockedMentionHas,
    },
  };

  client = {
    user: clientUser,
  };
});

describe("when the author is a bot", () => {
  beforeEach(() => {
    message.author.bot = true;
  });

  test("the handler early returns", () => {
    mh.handle(client, message);

    expect(mockedSend.mock.calls.length).toBe(0);
    expect(mockedReact.mock.calls.length).toBe(0);
  });
});

describe("when channel is 'video-förslag'", () => {
  beforeEach(() => {
    message.channel.id = "809393742637170708";
  });

  test("the handler reacts with yes/no emojis", () => {
    mh.handle(client, message);

    expect(mockedReact.mock.calls.length).toBe(2);
    expect(mockedReact.mock.calls[0][0]).toBe("✅");
    expect(mockedReact.mock.calls[1][0]).toBe("❌");
  });
});

describe("when GamingBot is mentioned", () => {
  beforeEach(() => {
    mockedMentions = [clientUser, 'arne'];
  });

  test("the handler responds with hello", () => {
    mh.handle(client, message);

    expect(mockedSend.mock.calls.length).toBe(1);
    expect(mockedSend.mock.calls[0][0]).toBe("Hej, jag är en bot som gamear på min fritid!");
  });
});

describe("when someone asks about the time", () => {
  beforeEach(() => {
    message.content = "Hallå hur MYCKET är klockan egentligen?";
  });

  test("the handler responds with the time", () => {
    mh.handle(client, message);

    expect(mockedSend.mock.calls.length).toBe(1);
    expect(mockedSend.mock.calls[0][0]).toMatch(/Klockan är/);
  });
});

describe("when someone talks about gaming", () => {
  beforeEach(() => {
    message.content = "Let's do some Ga ming!";
  });

  describe("when the odds are in our favor", () => {
    beforeEach(() => {
      jest.spyOn(global.Math, 'random').mockReturnValue(1);
    });

    describe("when channel is 809483972282810390", () => {
      beforeEach(() => {
        message.channel.id = "809483972282810390";
      });

      test("the handler responds with gaming", () => {
        mh.handle(client, message);

        expect(mockedSend.mock.calls.length).toBe(1);
        expect(mockedSend.mock.calls[0][0]).toBe("**GAMING! 🎮**");
      });
    });

    describe("when channel is 780765093343395880", () => {
      beforeEach(() => {
        message.channel.id = "780765093343395880";
      });

      test("the handler responds with gaming", () => {
        mh.handle(client, message);

        expect(mockedSend.mock.calls.length).toBe(1);
        expect(mockedSend.mock.calls[0][0]).toBe("**GAMING! 🎮**");
      });
    });

    describe("when channel is somethingelse", () => {
      beforeEach(() => {
        message.channel.id = "somethingelse";
      });

      test("the handler does not respond with gaming", () => {
        mh.handle(client, message);

        expect(mockedSend.mock.calls.length).toBe(0);
      });
    });
  });

  describe("when the odds are not in our favor", () => {
    beforeEach(() => {
      jest.spyOn(global.Math, 'random').mockReturnValue(0.345);
    });

    describe("when channel is 809483972282810390", () => {
      beforeEach(() => {
        message.channel.id = "809483972282810390";
      });

      test("the handler responds with gaming", () => {
        mh.handle(client, message);

        expect(mockedSend.mock.calls.length).toBe(0);
      });
    });

    describe("when channel is 780765093343395880", () => {
      beforeEach(() => {
        message.channel.id = "780765093343395880";
      });

      test("the handler responds with gaming", () => {
        mh.handle(client, message);

        expect(mockedSend.mock.calls.length).toBe(0);
      });
    });

    describe("when channel is somethingelse", () => {
      beforeEach(() => {
        message.channel.id = "somethingelse";
      });

      test("the handler does not respond with gaming", () => {
        mh.handle(client, message);

        expect(mockedSend.mock.calls.length).toBe(0);
      });
    });
  });
});

describe("when someone talks about christerpog", () => {
  beforeEach(() => {
    message.content = "Min favorit är CHRISTERpog ju";
  });

  describe("when channel is 809483972282810390", () => {
    beforeEach(() => {
      message.channel.id = "809483972282810390";
    });

    test("the handler responds and reacts with christerpog", () => {
      mh.handle(client, message);

      expect(mockedSend.mock.calls.length).toBe(1);
      expect(mockedSend.mock.calls[0][0]).toBe("<:ChristerPOG:810255466952917052>");

      expect(mockedReact.mock.calls.length).toBe(1);
      expect(mockedReact.mock.calls[0][0]).toBe("810255466952917052");
    });
  });

  describe("when channel is 780765093343395880", () => {
    beforeEach(() => {
      message.channel.id = "780765093343395880";
    });

    test("the handler responds and reacts with christerpog", () => {
      mh.handle(client, message);

      expect(mockedSend.mock.calls.length).toBe(1);
      expect(mockedSend.mock.calls[0][0]).toBe("<:ChristerPOG:810255466952917052>");

      expect(mockedReact.mock.calls.length).toBe(1);
      expect(mockedReact.mock.calls[0][0]).toBe("810255466952917052");
    });
  });

  describe("when channel is somethingelse", () => {
    beforeEach(() => {
      message.channel.id = "somethingelse";
    });

    test("the handler does not respond or react with christerpog", () => {
      mh.handle(client, message);

      expect(mockedSend.mock.calls.length).toBe(0);
      expect(mockedReact.mock.calls.length).toBe(0);
    });
  });
});
