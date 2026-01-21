/**
 * UI Components Export Index
 *
 * Centralized exports for all UI primitive components.
 * Import from '@/components/ui' for convenience.
 */

// Button
export { Button, buttonVariants, type ButtonProps } from './Button';

// Skeleton
export {
  Skeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonMissionCard,
  SkeletonStat,
  SkeletonTable,
} from './Skeleton';

// Table
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  DataTable,
  type TableProps,
  type TableHeaderProps,
  type TableBodyProps,
  type TableFooterProps,
  type TableRowProps,
  type TableHeadProps,
  type TableCellProps,
  type TableCaptionProps,
  type Column,
  type DataTableProps,
} from './Table';

// Toast
export { ToastContainer } from './Toast';

// Individual components (not in folders)
export { Avatar, AvatarImage, AvatarFallback } from './avatar';
export { Badge, badgeVariants } from './badge';
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './card';
export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from './command';
export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from './dialog';
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from './dropdown-menu';
export { Input } from './input';
export { Popover, PopoverTrigger, PopoverContent } from './popover';
export { Progress } from './progress';
export { default as ProgressRing } from './ProgressRing';
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from './select';
export { Separator } from './separator';
export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from './sheet';
export { default as Sidebar } from './Sidebar';
export { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs';
export { ThemeToggle } from './ThemeToggle';
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './tooltip';
export { TraceLink } from './TraceLink';
export { LedgerLink } from './LedgerLink';

// Search & Filter Components
export { SearchInput, type SearchInputProps } from './SearchInput';
export {
  FilterBar,
  type FilterBarProps,
  type FilterGroup,
  type FilterOption,
} from './FilterBar';

// Error & Permission Components
export { ErrorBanner, type ErrorBannerProps } from './ErrorBanner';
export {
  PermissionGate,
  AccessDenied,
  RequirePermission,
  type PermissionGateProps,
  type AccessDeniedProps,
  type RequirePermissionProps,
} from './PermissionGate';
