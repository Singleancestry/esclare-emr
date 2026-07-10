export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      branches: {
        Row: {
          id: string;
          code: string;
          name: string;
          timezone: string;
          archived_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          name: string;
          timezone?: string;
          archived_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["branches"]["Insert"]>;
      };
      audit_events: {
        Row: {
          id: string;
          actor_employee_id: string | null;
          actor_role: string | null;
          branch_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string | null;
          patient_id: string | null;
          previous_value: Json | null;
          new_value: Json | null;
          reason: string | null;
          success: boolean;
          created_at: string;
        };
        Insert: {
          actor_employee_id?: string | null;
          actor_role?: string | null;
          branch_id?: string | null;
          action: string;
          entity_type: string;
          entity_id?: string | null;
          patient_id?: string | null;
          previous_value?: Json | null;
          new_value?: Json | null;
          reason?: string | null;
          success: boolean;
        };
        Update: never;
      };
    };
    Functions: {
      get_staff_context: {
        Args: Record<string, never>;
        Returns: Json;
      };
    };
  };
};
