import { NextResponse } from 'next/server'
import {
  defaultAccount,
  defaultTransactions,
  defaultBudgets,
  defaultPots,
} from '@/lib/defaultData'

export async function GET(request) {
    const cookieStore = request.cookies
    let defaultData = cookieStore.get('defaultData')
  
    // If cookie doesn't exist, initialize it with default data
    if (!defaultData) {
      const data = {
        account: defaultAccount,
        transactions: defaultTransactions,
        budgets: defaultBudgets,
        pots: defaultPots,
      }
  
      const response = NextResponse.json({ data })
      response.cookies.set('defaultData', JSON.stringify(data))
      return response
    }
  
    // Otherwise, return the stored default data
    return NextResponse.json({ data: JSON.parse(defaultData.value) })
  }
