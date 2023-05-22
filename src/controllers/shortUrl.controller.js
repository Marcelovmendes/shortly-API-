import { func } from "joi";
import { db } from "../database/database.connection.js";
import { nanoid } from "nanoid";
export async function postShorten(req, res) {
  const { url } = req.body;
  const { session } = res.locals;
  req.body = nanoid(6);
  const shortUrl = req.body;
  try {
    const userId = session;

    await db.query(
      `INSERT INTO urls ("originalUrl", "shortCode", "userId") VALUES ($1, $2, $3)`,
      [url, shortUrl, userId]
    );
    const body = await db.query(
      `SELECT urls.id, urls."shortCode" FROM urls WHERE "shortCode"=$1 AND "userId"=$2`,
      [shortUrl, userId]
    );

    res.status(201).send(body.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
}
export async function getUrlById(req, res) {
  const { id } = req.params;

  try {
    const body = await db.query(`SELECT * FROM urls WHERE id=$1`, [id]);
    if (!body.rows.length === 0)
      return res.status(404).send({ message: "Not Found" });

    res.status(200).send(body.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
}
export async function redirectUrl(req, res) {
  const { shortCode } = req.params;

  try {
    const result = await db.query(`SELECT * FROM urls WHERE "shortCode"=$1`, [
      shortCode,
    ]);
    if (result.rows.length === 0)
      return res.status(404).send({ message: "Not Found" });

    const url = result.rows[0].originalUrl;
    const visitCount = result.rows[0].visitCount + 1;

    await db.query(`UPDATE urls SET "shortCode" = $1 WHERE "visitCount" = $2`, [
      shortCode,
      visitCount,
    ]);
    res.redirect(url);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
}

export async function deleteUrl(req, res) {
  const { id } = req.params;
  try {
    const result = await db.query(`DELETE FROM urls WHERE id=$1`, [id]);

    if (!result) return res.status(404).send({ message: "Not Found" });

    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
}
export async function getUser(req, res) {
  try {
    const { userId } = res.locals.session;

    const result = await db.query(
      `SELECT u.id, u.name,
      (
        SELECT COALESCE(SUM(url."visitCount"), 0)
        FROM urls url
        WHERE url."userId" = u.id) as visitCount,
        JSON_AGG(JSON_BUILD_OBJECT(
          'id', url.id,
          'shortUrl', url."shortCode",
          'url', url."originalUrl",
          'visitCount', url."visitCount"
        )) as shortenedUrls
      FROM users u
      LEFT JOIN urls url ON u.id = url."userId"
      WHERE u.id = $1
      GROUP BY u.id`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).send({ message: "User not found" });
    }

    const user = {
      id: result.rows[0].id,
      name: result.rows[0].name,
      visitCount: parseInt(result.rows[0].visitCount) || 0,
      shortenedUrls: result.rows[0].shortenedUrls || [],
    };

    res.status(200).send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
}

export async function getRanking(req, res) {
  try {
    const ranking = await db.query(
      `SELECT u.id,u.name,(COUNT(url.id), as linksCount), (CoALESCE(SUM(url."visitCount"), 0))) 
       FROM users u 
       LEFT JOIN urls url ON u.id = url."userId" 
       GROUP BY u.id 
       ORDER BY visitCount DESC  ) `
    );
    const formattedRanking = ranking.rows.map((user) => {
      return {
        id: user.id,
        name: user.name,
        linksCount: user.linkscount,
        visitCount: user.visitcount,
      };
    });

    res.status(200).send(formattedRanking.rows);
  } catch {
    res.status(500).send(err.message);
  }
}
