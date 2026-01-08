import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

type RouteParams = {
  params: Promise<{ id: string; documentId: string }>;
};

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "UNAUTHORIZED", message: "You must be logged in" },
        { status: 401 }
      );
    }

    const { id: dealId, documentId } = await params;

    // Verify deal ownership
    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
      select: { userId: true },
    });

    if (!deal) {
      return NextResponse.json(
        { error: "NOT_FOUND", message: "Deal not found" },
        { status: 404 }
      );
    }

    if (deal.userId !== session.user.id) {
      return NextResponse.json(
        { error: "FORBIDDEN", message: "You don't have access to this deal" },
        { status: 403 }
      );
    }

    // Get document to delete from UploadThing
    const document = await prisma.document.findUnique({
      where: { id: documentId },
      select: { fileKey: true, dealId: true },
    });

    if (!document) {
      return NextResponse.json(
        { error: "NOT_FOUND", message: "Document not found" },
        { status: 404 }
      );
    }

    if (document.dealId !== dealId) {
      return NextResponse.json(
        { error: "FORBIDDEN", message: "Document does not belong to this deal" },
        { status: 403 }
      );
    }

    // Delete from UploadThing
    if (document.fileKey) {
      try {
        await utapi.deleteFiles(document.fileKey);
      } catch (error) {
        console.error("Error deleting file from UploadThing:", error);
        // Continue even if UploadThing deletion fails
      }
    }

    // Delete from database
    await prisma.document.delete({
      where: { id: documentId },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error deleting document:", error);
    return NextResponse.json(
      { error: "SERVER_ERROR", message: "Failed to delete document" },
      { status: 500 }
    );
  }
}

