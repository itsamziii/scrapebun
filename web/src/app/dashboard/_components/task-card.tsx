import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
import type { TaskCardProps } from "../../../lib/types";

export const TaskCard = ({
  icon,
  title,
  description,
  features,
  onSelect,
}: TaskCardProps) => (
  <Card className="glass-morphism border-white/10">
    <CardHeader className="pb-2">
      <div className="bg-ai-primary/20 mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
        {icon}
      </div>
      <CardTitle className="text-white">{title}</CardTitle>
      <CardDescription className="text-white/70">{description}</CardDescription>
    </CardHeader>
    <CardContent className="text-sm text-white/50">
      <ul className="mb-4 space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <Zap size={14} className="text-ai-primary mr-2" /> {feature}
          </li>
        ))}
      </ul>
    </CardContent>
    <CardFooter>
      <Button
        className="w-full bg-white/10 text-white hover:bg-white/20"
        onClick={onSelect}
      >
        Select <ArrowRight size={16} className="ml-2" />
      </Button>
    </CardFooter>
  </Card>
);

export default TaskCard;
