import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";

const Appointments = () => {
  return (
    <Card className="mt-5 border-gray-700 bg-gray-800 p-0">
      <CardContent className="flex flex-row items-center justify-between px-0">
        <div className="flex flex-col gap-2 px-4">
          <Badge className="bg-purple-950 text-purple-400">Confirmado</Badge>
          <h3 className="text-lg font-semibold">Cortes de cabelo</h3>
          <div className="flex items-center gap-3">
            <Avatar className="h-6 w-6">
              <AvatarImage
                src="https://utfs.io/f/c97a2dc9-cf62-468b-a851-bfd2bdde775f-16p.png"
                alt="Avatar"
              />
            </Avatar>
            <p className="text-sm">Vintage Barbe</p>
          </div>
        </div>
        <div className="flex flex-col justify-end border-l border-solid border-gray-600 px-10 py-5 text-gray-300">
          <span className="text-center text-gray-300">Junho</span>
          <span className="text-center text-3xl text-gray-300">15</span>
          <span className="text-center text-gray-300">12:45</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default Appointments;
