import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { uploadImage, deleteImage } from '@/lib/cloudinary';
import { MongoClient, ObjectId } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI!);

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;    // Upload to Cloudinary
    const uploadResult = await uploadImage(base64, {
      folder: 'lingo-hub/avatars',
      transformation: [
        { width: 400, height: 400, crop: 'fill', gravity: 'face' }
      ]
    });    await client.connect();
    const users = client.db().collection('users');
    const currentUser = await users.findOne({ email: session.user.email });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (currentUser?.avatar?.publicId) {
      try {
        await deleteImage(currentUser.avatar.publicId);
      } catch (error) {
        console.warn('Failed to delete old avatar:', error);
      }
    }

    await users.updateOne(
      { email: session.user.email },
      {
        $set: {
          'avatar.url': uploadResult.secure_url,
          'avatar.publicId': uploadResult.public_id,
          updatedAt: new Date()
        }
      }
    );

    return NextResponse.json({
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id
    });

  } catch (error) {
    console.error('Avatar upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload avatar' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }    await client.connect();
    const users = client.db().collection('users');
    const user = await users.findOne({ email: session.user.email });

    if (!user?.avatar?.publicId) {
      return NextResponse.json({ error: 'No avatar to delete' }, { status: 400 });
    }

    await deleteImage(user.avatar.publicId);

    await users.updateOne(
      { email: session.user.email },
      {
        $unset: { avatar: '' },
        $set: { updatedAt: new Date() }
      }
    );

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Avatar delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete avatar' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
