import { withPrisma } from "../methode/withPrisma";

export const handleAddUser = withPrisma(async (req, res, prisma) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "L'email et le mot de passe sont requis" });
      return;
    }

    // const generateSalt = await bcrypt.genSalt(20);
    // const hashedPassword = await bcrypt.hash(password, 30);

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
      data: { email, password },
    });

    if (!insertUser) {
      res
        .status(500)
        .json({ error: "Erreur lors de la création de l'utilisateur" });
      return;
    }

    res.status(200).json({
      message: "Utilisateur ajouté avec succès",
      user: insertUser,
    });

    // console.log("User added successfully:", insertUser);
  } catch (error) {
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});
