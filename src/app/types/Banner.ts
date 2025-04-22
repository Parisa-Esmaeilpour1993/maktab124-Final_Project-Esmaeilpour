export interface BannerProps {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  order: number;
  link: string;
  image: string;
  background: string;
}

export interface BannerFormDataProps {
  title: string;
  description: string;
  isActive: boolean;
  order: number;
  link: string;
}
export interface HeroBannerProps {
  title: string;
  description: string;
}
export interface AddBannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export interface BannerListProps {
  banners: BannerProps[];
  onRefresh: () => void;
}
