import { Router } from "express";
import sql from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  const rows = await sql`select * from themes order by id`;
  res.json(rows);
});

router.get("/skills/:name", async (req, res) => {
  // console.log(req.params);
  const { name } = req.params;
  const rows = await sql`
      SELECT *
      FROM themes
      WHERE name ILIKE ${`%${name}%`}
      `;
  res.send(rows);
});

router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const rows = await sql`select * from themes where id = ${id}`;
  res.send(rows);
});
// post
router.post("/", async (req, res) => {
  const { name, skills } = req.body;
  const skillsValue = JSON.stringify(skills);
  const rows = await sql`INSERT INTO themes (name, skills)
VALUES (${name}, ${skillsValue}::jsonb)`;
  res.send(rows[0]);
});

router.put("/:id/skills/:skillIndex/:status", async (req, res) => {
  const { id, skillIndex, status } = req.params;
  console.log(id, skillIndex, status);
  if (!["OK", "PROGRESS", "KO"].includes(status)) {
    return res.status(400).json({ error: "Status invalide" });
  }

  const result = await sql`
    SELECT skills FROM themes WHERE id = ${id}
  `;

  if (result.length === 0) {
    return res.status(404).json({ error: "Thème non trouvé" });
  }

  const skills = result[0].skills;

  if (!skills[skillIndex]) {
    return res.status(404).json({ error: "Compétence introuvable" });
  }

  const updatedSkills = skills.map((skill, index) =>
    index === Number(skillIndex) ? { ...skill, validation: status } : skill
  );

  await sql`
    UPDATE themes
    SET skills = ${JSON.stringify(updatedSkills)}::jsonb
    WHERE id = ${id}
  `;

  res.json(updatedSkills);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const rows = await sql`delete from themes where id = ${id}`;
  res.send(rows);
});

export default router;
