import { NextApiRequest, NextApiResponse } from "next";

import crypto from "crypto";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // basic authentication test, console log authentication header
  if (req.method === "POST") {
    if (!req.headers.authorization) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const auth = Buffer.from(req.headers.authorization, "base64")
      .toString()
      .split(":");
    const [password, username] = auth;
    res.json({ password, username });
  }
}
