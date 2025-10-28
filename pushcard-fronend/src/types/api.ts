// API Response Types
export interface PunchCard {
    id: string
    program_id: string 
    merchant_name: string
    merchant_logo_url: string | null
    wallet_brand_color?: string | null 
    program_name: string
    current_punches: number
    punches_required: number
    reward_credits: number
    status: 'active' | 'completed' | 'expired'
    created_at: string
    last_punched_at?: string
    reward_description?: string
  }
  export interface Program {
    id: string
    name: string
    punches_required: number
    merchant_id: string
    merchant_name: string
    merchant_logo_url: string | null
    reward_description?: string
    expires_after_days?: number
    brand_color?: string | null 
    active: boolean
  }
  
  export interface CreateCardResponse {
    success: boolean
    wallet_card_id: string
    auth_token: string
  }
  
