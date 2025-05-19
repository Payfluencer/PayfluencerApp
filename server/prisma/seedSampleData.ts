import * as bcrypt from "bcrypt";
import { Logger } from "borgen";
import { UserRole } from "../prisma/generated/prisma/client";
import { prisma } from "../database/prisma";

async function seedSampleData() {
  Logger.info({ message: "Seeding sample data..." });
  try {
    await seedCompany();
    await seedUser();
    await seedBounty();
    await seedReport();
    await seedChat();
    return true;
  } catch (err) {
    Logger.error({ message: "Sample data seeding failed: " + err });
    return false;
  }
}

// Seed a sample company
async function seedCompany() {
  Logger.info({ message: "Creating sample company..." });

  try {
    const existingCompany = await prisma.company.findFirst({
      where: { name: "Sample Company" },
    });

    if (!existingCompany) {
      await prisma.company.create({
        data: {
          name: "Sample Company",
          logo: "https://example.com/logo.png",
        },
      });

      Logger.info({
        message: "Sample company created successfully",
        messageColor: "greenBright",
      });
    } else {
      Logger.info({
        message: "Sample company already exists",
        messageColor: "magentaBright",
      });
    }
  } catch (err) {
    Logger.error({ message: "Error creating sample company: " + err });
  }
}

// Seed a sample user
async function seedUser() {
  Logger.info({ message: "Creating sample user..." });

  try {
    const existingUser = await prisma.user.findFirst({
      where: { email: "user@example.com" },
    });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash("password123", 10);

      await prisma.user.create({
        data: {
          name: "Sample User",
          email: "user@example.com",
          password: hashedPassword,
          role: UserRole.USER,
          profile_picture: "https://example.com/profile.jpg",
          bio: "This is a sample user for testing purposes",
          evm_wallet_address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
          isActive: true,
        },
      });

      Logger.info({
        message: "Sample user created successfully",
        messageColor: "greenBright",
      });
    } else {
      Logger.info({
        message: "Sample user already exists",
        messageColor: "magentaBright",
      });
    }
  } catch (err) {
    Logger.error({ message: "Error creating sample user: " + err });
  }
}

// Seed a sample bounty
async function seedBounty() {
  Logger.info({ message: "Creating sample bounty..." });

  try {
    const company = await prisma.company.findFirst({
      where: { name: "Sample Company" },
    });

    if (!company) {
      Logger.error({ message: "Company not found, cannot create bounty" });
      return;
    }

    const existingBounty = await prisma.bounty.findFirst({
      where: { company_id: company.id },
    });

    if (!existingBounty) {
      await prisma.bounty.create({
        data: {
          company_id: company.id,
          max_payout: 1000.5,
          nsfw: false,
          cursing: true,
          nudity: false,
          language: "English",
          age_restriction: 18,
        },
      });

      Logger.info({
        message: "Sample bounty created successfully",
        messageColor: "greenBright",
      });
    } else {
      Logger.info({
        message: "Sample bounty already exists",
        messageColor: "magentaBright",
      });
    }
  } catch (err) {
    Logger.error({ message: "Error creating sample bounty: " + err });
  }
}

// Seed a sample report
async function seedReport() {
  Logger.info({ message: "Creating sample report..." });

  try {
    const user = await prisma.user.findFirst({
      where: { email: "user@example.com" },
    });

    const company = await prisma.company.findFirst({
      where: { name: "Sample Company" },
    });

    if (!user || !company) {
      Logger.error({
        message: "User or Company not found, cannot create report",
      });
      return;
    }

    const existingReport = await prisma.report.findFirst({
      where: {
        user_id: user.id,
        company_id: company.id,
      },
    });

    if (!existingReport) {
      await prisma.report.create({
        data: {
          user_id: user.id,
          company_id: company.id,
          title: "Sample Report",
          description: "This is a sample report for testing purposes",
          platform: "Website",
          status: "Open",
        },
      });

      Logger.info({
        message: "Sample report created successfully",
        messageColor: "greenBright",
      });
    } else {
      Logger.info({
        message: "Sample report already exists",
        messageColor: "magentaBright",
      });
    }
  } catch (err) {
    Logger.error({ message: "Error creating sample report: " + err });
  }
}

// Seed a sample chat message
async function seedChat() {
  Logger.info({ message: "Creating sample chat message..." });

  try {
    const user = await prisma.user.findFirst({
      where: { email: "user@example.com" },
    });

    const report = await prisma.report.findFirst();

    if (!user || !report) {
      Logger.error({
        message: "User or Report not found, cannot create chat message",
      });
      return;
    }

    const existingChat = await prisma.chat.findFirst({
      where: {
        user_id: user.id,
        report_id: report.id,
      },
    });

    if (!existingChat) {
      await prisma.chat.create({
        data: {
          user_id: user.id,
          report_id: report.id,
          message: "This is a sample chat message for testing purposes",
        },
      });

      Logger.info({
        message: "Sample chat created successfully",
        messageColor: "greenBright",
      });
    } else {
      Logger.info({
        message: "Sample chat already exists",
        messageColor: "magentaBright",
      });
    }
  } catch (err) {
    Logger.error({ message: "Error creating sample chat: " + err });
  }
}

export default seedSampleData;
