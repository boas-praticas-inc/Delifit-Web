import { LinkButton } from './LinkButton';

interface CrudActionsProps {
  viewTo: string;
}

export function CrudActions({ viewTo }: CrudActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <LinkButton to={viewTo} variant="ghost" size="sm">
        Ver
      </LinkButton>
    </div>
  );
}
