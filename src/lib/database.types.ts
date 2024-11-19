export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          created_at?: string
        }
        Insert: {
          id: string
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
        }
      }
      bookmarks: {
        Row: {
          id: string
          user_id: string
          url: string
          title: string
          description: string
          tags: string[]
          is_public: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          url: string
          title?: string
          description?: string
          tags?: string[]
          is_public?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          url?: string
          title?: string
          description?: string
          tags?: string[]
          is_public?: boolean
          created_at?: string
        }
      }
    }
  }
}