import { JwtUtil } from "@/utils/jwt";
import { withPrisma } from "../methode/withPrisma";
import bcrypt from "bcrypt";

export const handleAddUser = withPrisma(async (req, res, prisma) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "L'email et le mot de passe sont requis" });
      return;
    }

    const hashedPassword = bcrypt.hashSync(password, 16);

    // Utilisation de Prisma pour vérifier l'utilisateur
    const veryUser = await prisma.user.findUnique({ where: { email } });

    if (veryUser) {
      res
        .status(400)
        .json({ error: "Un utilisateur avec cet email existe déjà" });
      return;
    }

    // Utilisation de Prisma pour créer l'utilisateur
    const insertUser = await prisma.user.create({
      data: { email, password: hashedPassword },
    });

    if (!insertUser) {
      res
        .status(500)
        .json({ error: "Erreur lors de la création de l'utilisateur" });
      return;
    }

    const token = JwtUtil.generateToken(insertUser, "7d");
    const UpdateToken = await prisma.user.update({
      where: { id: insertUser.id },
      data: {
        token,
        tokenExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      }, // 7 jours
      select: {
        id: true,
        email: true,
        token: true,
        tokenExpiry: true,
      },
    });

    res.status(200).json({
      message: "Utilisateur ajouté avec succès",
      user: UpdateToken,
    });
    
  } catch (error) {
    res
      .status(500)
      .json({
        error: error instanceof Error ? error.message : "Erreur inconnue",
      });
  }
});
