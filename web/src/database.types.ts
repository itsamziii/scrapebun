export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      multiple_scrape_results: {
        Row: {
          chunk_number: number
          created: string | null
          embedding: string | null
          id: string
          task_id: string
          text: string
          title: string | null
          url: string | null
        }
        Insert: {
          chunk_number: number
          created?: string | null
          embedding?: string | null
          id?: string
          task_id: string
          text: string
          title?: string | null
          url?: string | null
        }
        Update: {
          chunk_number?: number
          created?: string | null
          embedding?: string | null
          id?: string
          task_id?: string
          text?: string
          title?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "multiple_scrape_results_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      single_scrape_results: {
        Row: {
          created: string | null
          data_csv: string | null
          data_json: Json | null
          format: string | null
          id: string
          task_id: string
          url: string
        }
        Insert: {
          created?: string | null
          data_csv?: string | null
          data_json?: Json | null
          format?: string | null
          id?: string
          task_id: string
          url: string
        }
        Update: {
          created?: string | null
          data_csv?: string | null
          data_json?: Json | null
          format?: string | null
          id?: string
          task_id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "single_scrape_results_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          created: string | null
          id: string
          scrape_type: string | null
          status: string
          user_id: string
        }
        Insert: {
          created?: string | null
          id?: string
          scrape_type?: string | null
          status?: string
          user_id?: string
        }
        Update: {
          created?: string | null
          id?: string
          scrape_type?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: Record<never, never>
    Functions: {
      get_multiple_scrape_result: {
        Args: { task_uuid: string }
        Returns: {
          task_id: string
          task_status: string
          task_created: string
          chunk_id: string
          embedding: string
          text: string
          chunk_number: number
          title: string
          url: string
          chunk_created: string
        }[]
      }
      get_single_scrape_result: {
        Args: { task_uuid: string }
        Returns: {
          task_id: string
          task_status: string
          task_created: string
          format: string
          data_json: Json
          data_csv: string
          result_created: string
        }[]
      }
      get_task_data: {
        Args: { task_uuid: string }
        Returns: {
          task_id: string
          task_user_id: string
          task_scrape_type: string
          task_status: string
          task_created: string
          single_result: Database["public"]["CompositeTypes"]["single_result_type"]
        }[]
      }
      requesting_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: Record<never, never>
    CompositeTypes: {
      multiple_result_type: {
        chunk_id: string | null
        embedding: string | null
        text: string | null
        chunk_number: number | null
        title: string | null
        url: string | null
        chunk_created: string | null
      }
      single_result_type: {
        format: string | null
        data_json: Json | null
        data_csv: string | null
      }
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
