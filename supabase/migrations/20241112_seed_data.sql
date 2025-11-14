-- Seed Data for Eduhome Platform
-- Created: 2024-11-12

-- Insert sample subjects
INSERT INTO public.subjects (name, description, grade_level) VALUES
('Mathematics', 'Core mathematical concepts including algebra, geometry, and calculus', 'All Levels'),
('English Language', 'Reading comprehension, writing, grammar, and literature', 'All Levels'),
('Science', 'Biology, chemistry, physics, and general science concepts', 'All Levels'),
('History', 'World history, local history, and historical analysis', 'All Levels'),
('Geography', 'Physical geography, world regions, and map skills', 'All Levels'),
('Physics', 'Classical mechanics, electricity, magnetism, and modern physics', 'Secondary'),
('Chemistry', 'Atomic structure, chemical reactions, and organic chemistry', 'Secondary'),
('Biology', 'Cell biology, genetics, ecology, and human anatomy', 'Secondary'),
('Computer Science', 'Programming fundamentals, algorithms, and computer concepts', 'All Levels'),
('Art & Design', 'Visual arts, creative expression, and design principles', 'All Levels'),
('Music', 'Music theory, instruments, and performance', 'All Levels'),
('Physical Education', 'Sports, fitness, and health education', 'All Levels'),
('Foreign Language', 'Second language acquisition and communication', 'All Levels'),
('Economics', 'Microeconomics, macroeconomics, and financial literacy', 'Secondary'),
('Literature', 'Literary analysis, classic and contemporary works', 'Secondary');

-- Insert sample grade levels for subjects
INSERT INTO public.subjects (name, description, grade_level) VALUES
('Mathematics - Primary', 'Basic arithmetic, number sense, and problem solving for grades 1-6', 'Primary'),
('Mathematics - Secondary', 'Advanced algebra, geometry, and trigonometry for grades 7-12', 'Secondary'),
('English - Primary', 'Reading fundamentals and basic writing skills for grades 1-6', 'Primary'),
('English - Secondary', 'Advanced literature, composition, and critical thinking for grades 7-12', 'Secondary'),
('Science - Primary', 'Basic scientific concepts and hands-on experiments for grades 1-6', 'Primary'),
('Science - Secondary', 'Specialized sciences and laboratory work for grades 7-12', 'Secondary');