-- Create enum for resource types
CREATE TYPE resource_type AS ENUM ('water', 'food', 'medical', 'shelter', 'equipment', 'other');

-- Create enum for unit of measure
CREATE TYPE unit_of_measure AS ENUM ('units', 'liters', 'kilograms', 'boxes', 'cases', 'pallets');

-- Create enum for request status
CREATE TYPE request_status AS ENUM ('pending', 'approved', 'in_progress', 'completed', 'cancelled');

-- Create resources table
CREATE TABLE public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type resource_type NOT NULL,
  unit_of_measure unit_of_measure NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create locations table
CREATE TABLE public.locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  contact_name TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create inventory table
CREATE TABLE public.inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
  location_id UUID NOT NULL REFERENCES public.locations(id) ON DELETE CASCADE,
  quantity_available DECIMAL(10,2) NOT NULL DEFAULT 0,
  minimum_threshold DECIMAL(10,2) DEFAULT 0,
  last_updated_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(resource_id, location_id)
);

-- Create requests table
CREATE TABLE public.requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
  location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
  quantity_needed DECIMAL(10,2) NOT NULL,
  requester_name TEXT NOT NULL,
  requester_contact TEXT,
  priority TEXT DEFAULT 'medium',
  status request_status NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users (all can read, insert, update, delete for now)
-- Resources policies
CREATE POLICY "Allow all operations for authenticated users" ON public.resources
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Locations policies
CREATE POLICY "Allow all operations for authenticated users" ON public.locations
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Inventory policies
CREATE POLICY "Allow all operations for authenticated users" ON public.inventory
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Requests policies
CREATE POLICY "Allow all operations for authenticated users" ON public.requests
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON public.resources
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON public.locations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_requests_updated_at BEFORE UPDATE ON public.requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger to update inventory last_updated_date
CREATE TRIGGER update_inventory_last_updated BEFORE UPDATE ON public.inventory
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better query performance
CREATE INDEX idx_inventory_resource_id ON public.inventory(resource_id);
CREATE INDEX idx_inventory_location_id ON public.inventory(location_id);
CREATE INDEX idx_requests_resource_id ON public.requests(resource_id);
CREATE INDEX idx_requests_location_id ON public.requests(location_id);
CREATE INDEX idx_requests_status ON public.requests(status);