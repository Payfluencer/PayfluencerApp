import { Logger } from "borgen";
import { HttpStatusCode } from "axios";
import { prisma } from "../database/prisma";
import type { IServerResponse } from "../types";
import type { Request, Response } from "express";
import { UserRole } from "../prisma/generated/prisma/client";

/**
 * @openapi
 * components:
 *   schemas:
 *     Bounty:
 *       type: object
 *       required:
 *         - id
 *         - title
 *         - description
 *         - company_id
 *         - platform
 *       properties:
 *         id:
 *           type: string
 *           description: The bounty ID
 *         title:
 *           type: string
 *           description: Bounty title
 *         description:
 *           type: string
 *           description: Detailed bounty description
 *         company_id:
 *           type: string
 *           description: ID of the company offering the bounty
 *         max_payout:
 *           type: number
 *           description: Maximum payment amount for the bounty
 *         nsfw:
 *           type: boolean
 *           description: Whether the bounty allows NSFW content
 *         cursing:
 *           type: boolean
 *           description: Whether the bounty allows cursing
 *         nudity:
 *           type: boolean
 *           description: Whether the bounty allows nudity
 *         language:
 *           type: string
 *           description: Required language for the bounty content
 *         age_restriction:
 *           type: integer
 *           description: Age restriction for the bounty
 *         required_views:
 *           type: integer
 *           description: Required number of views for the content
 *         required_likes:
 *           type: integer
 *           description: Required number of likes for the content
 *         required_comments:
 *           type: integer
 *           description: Required number of comments for the content
 *         required_saves:
 *           type: integer
 *           description: Required number of saves for the content
 *         platform:
 *           type: string
 *           description: Platform where the content should be posted
 *         status:
 *           type: string
 *           description: Current status of the bounty
 *         is_active:
 *           type: boolean
 *           description: Whether the bounty is currently active
 *         show_other_brands:
 *           type: boolean
 *           description: Whether other brands can be shown in the content
 *         specific_products:
 *           type: string
 *           description: Specific products that should be featured
 *         pay_duration:
 *           type: string
 *           description: Payment duration terms
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Bounty creation date
 *         update_at:
 *           type: string
 *           format: date-time
 *           description: Bounty update date
 */

/**
 * @openapi
 * /api/v1/bounties:
 *   get:
 *     summary: Get all public bounties with pagination
 *     tags: [Bounty]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Bounties found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Bounties found
 *                 data:
 *                   type: object
 *                   properties:
 *                     bounties:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Bounty'
 *                     totalBounties:
 *                       type: integer
 *                     page:
 *                       type: integer
 *       500:
 *         description: Internal server error
 */
export const getAllBounties = async (
  req: Request,
  res: Response<IServerResponse>
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [bounties, totalBounties] = await Promise.all([
      prisma.bounty.findMany({
        where: {
          is_active: true,
        },
        include: {
          company: {
            select: {
              id: true,
              name: true,
              logo: true,
            },
          },
        },
        orderBy: {
          created_at: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.bounty.count({
        where: {
          is_active: true,
        },
      }),
    ]);

    res.status(HttpStatusCode.Ok).json({
      status: "success",
      message: "Bounties found",
      data: {
        bounties,
        totalBounties,
        page,
      },
    });
  } catch (err) {
    Logger.error({ message: "Error getting all bounties: " + err });

    res.status(HttpStatusCode.InternalServerError).json({
      status: "error",
      message: "Error getting all bounties",
      data: null,
    });
  }
};

/**
 * @openapi
 * /api/v1/bounties/{id}:
 *   get:
 *     summary: Get details for a specific bounty
 *     tags: [Bounty]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bounty ID
 *     responses:
 *       200:
 *         description: Bounty found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Bounty found
 *                 data:
 *                   type: object
 *                   properties:
 *                     bounty:
 *                       $ref: '#/components/schemas/Bounty'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Bounty not found
 *       500:
 *         description: Internal server error
 */
export const getBountyById = async (
  req: Request,
  res: Response<IServerResponse>
) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: "error",
        message: "Bounty ID is required",
        data: null,
      });
    }

    const bounty = await prisma.bounty.findUnique({
      where: { id },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
            email: true,
          },
        },
      },
    });

    if (!bounty) {
      return res.status(HttpStatusCode.NotFound).json({
        status: "error",
        message: "Bounty not found",
        data: null,
      });
    }

    res.status(HttpStatusCode.Ok).json({
      status: "success",
      message: "Bounty found",
      data: { bounty },
    });
  } catch (err) {
    Logger.error({ message: "Error getting bounty: " + err });
    res.status(HttpStatusCode.InternalServerError).json({
      status: "error",
      message: "Error getting bounty",
      data: null,
    });
  }
};

/**
 * @openapi
 * /api/v1/bounties:
 *   post:
 *     summary: Create a new bounty
 *     tags: [Bounty]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - company_id
 *               - platform
 *               - max_payout
 *               - nsfw
 *               - cursing
 *               - nudity
 *               - language
 *               - age_restriction
 *               - required_views
 *               - required_likes
 *               - required_comments
 *               - required_saves
 *               - show_other_brands
 *               - specific_products
 *               - pay_duration
 *             properties:
 *               title:
 *                 type: string
 *                 description: Bounty title
 *               description:
 *                 type: string
 *                 description: Detailed bounty description
 *               company_id:
 *                 type: string
 *                 description: ID of the company offering the bounty
 *               max_payout:
 *                 type: number
 *                 description: Maximum payment amount for the bounty
 *               nsfw:
 *                 type: boolean
 *                 description: Whether the bounty allows NSFW content
 *               cursing:
 *                 type: boolean
 *                 description: Whether the bounty allows cursing
 *               nudity:
 *                 type: boolean
 *                 description: Whether the bounty allows nudity
 *               language:
 *                 type: string
 *                 description: Required language for the bounty content
 *               age_restriction:
 *                 type: integer
 *                 description: Age restriction for the bounty
 *               required_views:
 *                 type: integer
 *                 description: Required number of views for the content
 *               required_likes:
 *                 type: integer
 *                 description: Required number of likes for the content
 *               required_comments:
 *                 type: integer
 *                 description: Required number of comments for the content
 *               required_saves:
 *                 type: integer
 *                 description: Required number of saves for the content
 *               platform:
 *                 type: string
 *                 description: Platform where the content should be posted
 *               show_other_brands:
 *                 type: boolean
 *                 description: Whether other brands can be shown in the content
 *               specific_products:
 *                 type: string
 *                 description: Specific products that should be featured
 *               pay_duration:
 *                 type: string
 *                 description: Payment duration terms
 *     responses:
 *       200:
 *         description: Bounty created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Bounty created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     bounty:
 *                       $ref: '#/components/schemas/Bounty'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
export const createBounty = async (
  req: Request,
  res: Response<IServerResponse>
) => {
  try {
    const {
      title,
      description,
      company_id,
      max_payout,
      nsfw,
      cursing,
      nudity,
      language,
      age_restriction,
      required_views,
      required_likes,
      required_comments,
      required_saves,
      platform,
      show_other_brands,
      specific_products,
      pay_duration,
    } = req.body;

    if (!title || !description || !company_id || !platform) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: "error",
        message: "Required fields missing",
        data: null,
      });
    }

    // Check if company exists
    const companyExists = await prisma.company.findUnique({
      where: { id: company_id },
    });

    if (!companyExists) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: "error",
        message: "Company not found",
        data: null,
      });
    }

    const bounty = await prisma.bounty.create({
      data: {
        title,
        description,
        company_id,
        max_payout,
        nsfw,
        cursing,
        nudity,
        language,
        age_restriction,
        required_views,
        required_likes,
        required_comments,
        required_saves,
        platform,
        status: "ACTIVE",
        is_active: true,
        show_other_brands,
        specific_products,
        pay_duration,
      },
    });

    res.status(HttpStatusCode.Ok).json({
      status: "success",
      message: "Bounty created successfully",
      data: { bounty },
    });
  } catch (err) {
    Logger.error({ message: "Error creating bounty: " + err });
    res.status(HttpStatusCode.InternalServerError).json({
      status: "error",
      message: "Error creating bounty",
      data: null,
    });
  }
};

/**
 * @openapi
 * /api/v1/bounties/{id}:
 *   put:
 *     summary: Update an existing bounty
 *     tags: [Bounty]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bounty ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Bounty title
 *               description:
 *                 type: string
 *                 description: Detailed bounty description
 *               max_payout:
 *                 type: number
 *                 description: Maximum payment amount for the bounty
 *               nsfw:
 *                 type: boolean
 *                 description: Whether the bounty allows NSFW content
 *               cursing:
 *                 type: boolean
 *                 description: Whether the bounty allows cursing
 *               nudity:
 *                 type: boolean
 *                 description: Whether the bounty allows nudity
 *               language:
 *                 type: string
 *                 description: Required language for the bounty content
 *               age_restriction:
 *                 type: integer
 *                 description: Age restriction for the bounty
 *               required_views:
 *                 type: integer
 *                 description: Required number of views for the content
 *               required_likes:
 *                 type: integer
 *                 description: Required number of likes for the content
 *               required_comments:
 *                 type: integer
 *                 description: Required number of comments for the content
 *               required_saves:
 *                 type: integer
 *                 description: Required number of saves for the content
 *               platform:
 *                 type: string
 *                 description: Platform where the content should be posted
 *               status:
 *                 type: string
 *                 description: Current status of the bounty
 *               is_active:
 *                 type: boolean
 *                 description: Whether the bounty is currently active
 *               show_other_brands:
 *                 type: boolean
 *                 description: Whether other brands can be shown in the content
 *               specific_products:
 *                 type: string
 *                 description: Specific products that should be featured
 *               pay_duration:
 *                 type: string
 *                 description: Payment duration terms
 *     responses:
 *       200:
 *         description: Bounty updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Bounty updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     bounty:
 *                       $ref: '#/components/schemas/Bounty'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Bounty not found
 *       500:
 *         description: Internal server error
 */
export const updateBounty = async (
  req: Request,
  res: Response<IServerResponse>
) => {
  const { id } = req.params;
  const companyId = res.locals.companyId; // From auth middleware if available
  const userRole = res.locals.userRole || null;

  try {
    if (!id) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: "error",
        message: "Bounty ID is required",
        data: null,
      });
    }

    // Get the existing bounty
    const existingBounty = await prisma.bounty.findUnique({
      where: { id },
    });

    if (!existingBounty) {
      return res.status(HttpStatusCode.NotFound).json({
        status: "error",
        message: "Bounty not found",
        data: null,
      });
    }

    // Check if user has permission (admin or the company that created the bounty)
    if (
      userRole !== UserRole.ADMIN &&
      existingBounty.company_id !== companyId
    ) {
      return res.status(HttpStatusCode.Forbidden).json({
        status: "error",
        message: "You don't have permission to update this bounty",
        data: null,
      });
    }

    // Extract fields from the request body
    const {
      title,
      description,
      max_payout,
      nsfw,
      cursing,
      nudity,
      language,
      age_restriction,
      required_views,
      required_likes,
      required_comments,
      required_saves,
      platform,
      status,
      is_active,
      show_other_brands,
      specific_products,
      pay_duration,
    } = req.body;

    // Build update data with non-null values
    const updateData: Record<string, any> = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (max_payout !== undefined) updateData.max_payout = max_payout;
    if (nsfw !== undefined) updateData.nsfw = nsfw;
    if (cursing !== undefined) updateData.cursing = cursing;
    if (nudity !== undefined) updateData.nudity = nudity;
    if (language !== undefined) updateData.language = language;
    if (age_restriction !== undefined)
      updateData.age_restriction = age_restriction;
    if (required_views !== undefined)
      updateData.required_views = required_views;
    if (required_likes !== undefined)
      updateData.required_likes = required_likes;
    if (required_comments !== undefined)
      updateData.required_comments = required_comments;
    if (required_saves !== undefined)
      updateData.required_saves = required_saves;
    if (platform !== undefined) updateData.platform = platform;
    if (status !== undefined) updateData.status = status;
    if (is_active !== undefined) updateData.is_active = is_active;
    if (show_other_brands !== undefined)
      updateData.show_other_brands = show_other_brands;
    if (specific_products !== undefined)
      updateData.specific_products = specific_products;
    if (pay_duration !== undefined) updateData.pay_duration = pay_duration;

    // Update the bounty
    const updatedBounty = await prisma.bounty.update({
      where: { id },
      data: updateData,
    });

    res.status(HttpStatusCode.Ok).json({
      status: "success",
      message: "Bounty updated successfully",
      data: { bounty: updatedBounty },
    });
  } catch (err) {
    Logger.error({ message: "Error updating bounty: " + err });

    if ((err as any).code === "P2025") {
      return res.status(HttpStatusCode.NotFound).json({
        status: "error",
        message: "Bounty not found",
        data: null,
      });
    }

    res.status(HttpStatusCode.InternalServerError).json({
      status: "error",
      message: "Error updating bounty",
      data: null,
    });
  }
};

/**
 * @openapi
 * /api/v1/bounties/{id}:
 *   delete:
 *     summary: Delete a bounty
 *     tags: [Bounty]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bounty ID to delete
 *     responses:
 *       200:
 *         description: Bounty deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Bounty deleted successfully
 *                 data:
 *                   type: null
 *       400:
 *         description: Bad request
 *       403:
 *         description: Forbidden - Not authorized to delete this bounty
 *       404:
 *         description: Bounty not found
 *       500:
 *         description: Internal server error
 */
export const deleteBounty = async (
  req: Request,
  res: Response<IServerResponse>
) => {
  const { id } = req.params;
  const companyId = res.locals.companyId; // From auth middleware if available
  const userRole = res.locals.userRole || null;

  try {
    if (!id) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: "error",
        message: "Bounty ID is required",
        data: null,
      });
    }

    // Get the existing bounty
    const existingBounty = await prisma.bounty.findUnique({
      where: { id },
    });

    if (!existingBounty) {
      return res.status(HttpStatusCode.NotFound).json({
        status: "error",
        message: "Bounty not found",
        data: null,
      });
    }

    // Check if user has permission (admin or the company that created the bounty)
    if (
      userRole !== UserRole.ADMIN &&
      existingBounty.company_id !== companyId
    ) {
      return res.status(HttpStatusCode.Forbidden).json({
        status: "error",
        message: "You don't have permission to delete this bounty",
        data: null,
      });
    }

    // Delete the bounty
    await prisma.bounty.delete({
      where: { id },
    });

    res.status(HttpStatusCode.Ok).json({
      status: "success",
      message: "Bounty deleted successfully",
      data: null,
    });
  } catch (err) {
    Logger.error({ message: "Error deleting bounty: " + err });

    if ((err as any).code === "P2025") {
      return res.status(HttpStatusCode.NotFound).json({
        status: "error",
        message: "Bounty not found",
        data: null,
      });
    }

    res.status(HttpStatusCode.InternalServerError).json({
      status: "error",
      message: "Error deleting bounty",
      data: null,
    });
  }
};

/**
 * @openapi
 * /api/v1/bounties/search:
 *   get:
 *     summary: Search for bounties by title
 *     tags: [Bounty]
 *     parameters:
 *       - in: query
 *         name: term
 *         required: true
 *         schema:
 *           type: string
 *         description: Search term for bounty title
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Maximum number of results to return
 *     responses:
 *       200:
 *         description: Bounties found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Bounties found
 *                 data:
 *                   type: object
 *                   properties:
 *                     bounties:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Bounty'
 *                     total:
 *                       type: integer
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
export const searchBounty = async (
  req: Request,
  res: Response<IServerResponse>
) => {
  const { term, limit } = req.query;
  try {
    if (!term || typeof term !== "string") {
      return res.status(HttpStatusCode.BadRequest).json({
        status: "error",
        message: "Search term is required",
        data: null,
      });
    }

    const searchLimit = parseInt(limit as string) || 20;

    // Search bounties by title
    const bounties = await prisma.bounty.findMany({
      where: {
        title: { contains: term, mode: "insensitive" },
        is_active: true,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
      take: searchLimit,
    });

    const total = await prisma.bounty.count({
      where: {
        title: { contains: term, mode: "insensitive" },
        is_active: true,
      },
    });

    res.status(HttpStatusCode.Ok).json({
      status: "success",
      message:
        bounties.length > 0
          ? "Bounties found"
          : "No bounties found matching the search criteria",
      data: {
        bounties,
        total,
      },
    });
  } catch (err) {
    Logger.error({ message: "Error searching bounties: " + err });

    res.status(HttpStatusCode.InternalServerError).json({
      status: "error",
      message: "Error searching bounties",
      data: null,
    });
  }
};

/**
 * @openapi
 * /api/v1/bounties/company/{companyId}:
 *   get:
 *     summary: Get all bounties for a specific company
 *     tags: [Bounty]
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema:
 *           type: string
 *         description: Company ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Bounties found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Bounties found
 *                 data:
 *                   type: object
 *                   properties:
 *                     bounties:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Bounty'
 *                     totalBounties:
 *                       type: integer
 *                     page:
 *                       type: integer
 *       400:
 *         description: Bad request
 *       404:
 *         description: Company not found
 *       500:
 *         description: Internal server error
 */
export const getBountiesByCompany = async (
  req: Request,
  res: Response<IServerResponse>
) => {
  const { companyId } = req.params;
  try {
    if (!companyId) {
      return res.status(HttpStatusCode.BadRequest).json({
        status: "error",
        message: "Company ID is required",
        data: null,
      });
    }

    // Check if company exists
    const companyExists = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!companyExists) {
      return res.status(HttpStatusCode.NotFound).json({
        status: "error",
        message: "Company not found",
        data: null,
      });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [bounties, totalBounties] = await Promise.all([
      prisma.bounty.findMany({
        where: {
          company_id: companyId,
          is_active: true,
        },
        include: {
          company: {
            select: {
              id: true,
              name: true,
              logo: true,
            },
          },
        },
        orderBy: {
          created_at: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.bounty.count({
        where: {
          company_id: companyId,
          is_active: true,
        },
      }),
    ]);

    res.status(HttpStatusCode.Ok).json({
      status: "success",
      message:
        bounties.length > 0
          ? `Found ${bounties.length} bounties for the company`
          : "No bounties found for this company",
      data: {
        bounties,
        totalBounties,
        page,
      },
    });
  } catch (err) {
    Logger.error({ message: "Error getting company bounties: " + err });

    res.status(HttpStatusCode.InternalServerError).json({
      status: "error",
      message: "Error getting company bounties",
      data: null,
    });
  }
};
