import { MapPin, HelpCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import type { RegionData } from '../App';

interface HeaderProps {
  selectedDepartment: string;
  onDepartmentChange: (value: string) => void;
  departments: RegionData[];
  onHelpClick: () => void;
}

export function Header({ selectedDepartment, onDepartmentChange, departments, onHelpClick }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600 shadow-lg">
      <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-white p-3 rounded-xl shadow-lg">
            <MapPin className="w-7 h-7 text-blue-600" />
          </div>
          <div>
            <h1 className="text-white">Utz K’aslem</h1>
            <p className="text-blue-100">Recomendaciones para su siembra</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex-1 sm:flex-initial sm:w-64">
            <Select value={selectedDepartment} onValueChange={onDepartmentChange}>
              <SelectTrigger className="bg-white border-2 border-blue-300 text-blue-900 h-12">
                <SelectValue placeholder="Seleccione Departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">
                  <span>📍 Todos los Departamentos</span>
                </SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept.id} value={dept.id}>
                    <span>📍 {dept.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <button 
            onClick={onHelpClick}
            className="bg-white text-blue-700 px-4 py-3 rounded-lg hover:bg-blue-50 transition-colors shadow-md flex items-center gap-2 whitespace-nowrap"
          >
            <HelpCircle className="w-5 h-5" />
            <span className="hidden sm:inline">Ayuda</span>
          </button>
        </div>
      </div>
    </header>
  );
}
