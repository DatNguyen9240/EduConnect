import type { Profile } from '../types/profile';
import { mockProfileData } from '../data/profile-data';

// Service để handle các API calls liên quan đến profile
export class ProfileService {
  // Simulate API call to get profile
  static async getProfile(): Promise<Profile> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // In real app, this would be:
    // const response = await fetch(`/api/profile/${userId}`)
    // return response.json()

    return mockProfileData;
  }

  // Simulate API call to update profile
  static async updateProfile(profileData: Partial<Profile>): Promise<Profile> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    // In real app:
    // const response = await fetch('/api/profile/update', {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(profileData)
    // })
    // return response.json()

    return { ...mockProfileData, ...profileData };
  }

  // Simulate API call to change password
  static async changePassword(): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 600));

    // In real app:
    // const response = await fetch('/api/profile/change-password', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ oldPassword, newPassword })
    // })
    // return response.ok

    return true; // Mock success
  }
}
