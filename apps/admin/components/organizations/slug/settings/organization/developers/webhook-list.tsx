'use client';

import * as React from 'react';
import NiceModal from '@ebay/nice-modal-react';
import { MoreHorizontalIcon, ZapIcon } from 'lucide-react';

import { WebhookTrigger } from '@workspace/database';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@workspace/ui/components/dropdown-menu';
import { cn } from '@workspace/ui/lib/utils';

import { DeleteWebhookModal } from '~/components/organizations/slug/settings/organization/developers/delete-webhook-modal';
import { EditWebhookModal } from '~/components/organizations/slug/settings/organization/developers/edit-webhook-modal';
import { webhookTriggerLabels } from '~/lib/labels';
import type { WebhookDto } from '~/types/dtos/webhook-dto';

export type WebhookListProps = React.HtmlHTMLAttributes<HTMLUListElement> & {
  webhooks: WebhookDto[];
};

export function WebhookList({
  webhooks,
  className,
  ...other
}: WebhookListProps): React.JSX.Element {
  return (
    <ul
      role="list"
      className={cn('m-0 list-none divide-y p-0', className)}
      {...other}
    >
      {webhooks.map((webhook) => (
        <WebhookListItem
          key={webhook.id}
          webhook={webhook}
        />
      ))}
    </ul>
  );
}

type WebhookListItemProps = React.HtmlHTMLAttributes<HTMLLIElement> & {
  webhook: WebhookDto;
};

function WebhookListItem({
  webhook,
  className,
  ...other
}: WebhookListItemProps): React.JSX.Element {
  const handleShowUpdateWebhookModal = (): void => {
    NiceModal.show(EditWebhookModal, { webhook });
  };
  const handleShowDeleteWebhookModal = (): void => {
    NiceModal.show(DeleteWebhookModal, { webhook });
  };
  return (
    <li
      role="listitem"
      className={cn(
        'flex h-fit w-full flex-row justify-between gap-4 p-6',
        className
      )}
      {...other}
    >
      <div className="flex flex-col">
        <div className="break-all text-sm font-medium">{webhook.url}</div>
        {webhook.triggers.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-1">
            {webhook.triggers.map((trigger) => (
              <Badge
                key={trigger}
                variant="secondary"
              >
                <ZapIcon className="mr-1 size-3 shrink-0" />
                {webhookTriggerLabels[trigger as WebhookTrigger]}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">No trigger configured</p>
        )}
      </div>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            className="size-8 p-0"
            title="Open menu"
          >
            <MoreHorizontalIcon className="size-4 shrink-0" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={handleShowUpdateWebhookModal}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="!text-destructive cursor-pointer"
            onClick={handleShowDeleteWebhookModal}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  );
}
