import { NextResponse, NextRequest } from 'next/server';
import Cart from './db';

export async function POST(NextRequest) {
  const reqBody = await NextRequest.json();
  const { userId, item, action } = reqBody;

  try {
    let cart = await Cart.findOne({ userId });

    if (action === 'add') {
      if (!cart) {
        cart = new Cart({ userId, items: [] });
      }
      const existingItemIndex = cart.items.findIndex(i => i.itemId === item.itemId);
      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += item.quantity;
      } else {
        cart.items.push(item);
      }
      await cart.save();
      return NextResponse.json({ success: true, cart: cart.items });
    } else if (action === 'remove') {
      if (!cart) {
        return NextResponse.json({ success: false, message: 'Cart not found' }, { status: 404 });
      }
      cart.items = cart.items.filter(i => i.itemId !== item.itemId);
      await cart.save();
      return NextResponse.json({ success: true, cart: cart.items });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(NextRequest) {
  const { userId } = NextRequest.url.searchParams;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return NextResponse.json({ success: false, message: 'Cart not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, cart: cart.items });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
