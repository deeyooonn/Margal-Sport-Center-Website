export const manifest = {
  screens: {
    scr_cfpw52: { name: "Home", route: "/", position: { "x": 160, "y": 2200 } },
    scr_189eny: { name: "Login", route: "/login", position: { "x": 160, "y": 220 } },
    scr_evy05h: { name: "Sign Up", route: "/signup", position: { "x": 1560, "y": 220 } },
    scr_4s3aj7: { name: "Booking", route: "/book", position: { "x": 1560, "y": 2200 } },
    scr_t8opky: { name: "Event Rental", route: "/events", position: { "x": 2960, "y": 2200 } }
  },
  sections: {
    sec_54w2ed: { name: "Authentication", x: 0, y: 0, width: 2920, height: 1180 },
    sec_s6b9ws: { name: "Main Features", x: 0, y: 1980, width: 4320, height: 1180 }
  },
  layers: [
  { kind: "section", id: "sec_54w2ed", children: [
    { kind: "screen", id: "scr_189eny" },
    { kind: "screen", id: "scr_evy05h" }]
  },
  { kind: "section", id: "sec_s6b9ws", children: [
    { kind: "screen", id: "scr_cfpw52" },
    { kind: "screen", id: "scr_4s3aj7" },
    { kind: "screen", id: "scr_t8opky" }]
  }]

};