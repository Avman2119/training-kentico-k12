﻿using CMS.Membership;
using Kentico.Membership;

using Business.Services.Context;
using Business.Identity.Models;
using Business.Identity.Helpers;

namespace Business.Identity.Extensions
{
    public static class UserExtensions
    {
        public static MedioClinicUser ToMedioClinicUser(this UserInfo userInfo, ISiteContextService siteContextService)
        {
            if (new User(UserInfoProvider.CheckUserBelongsToSite(userInfo, siteContextService.SiteName)) is MedioClinicUser medioClinicUser)
            {
                medioClinicUser.DateOfBirth = userInfo.UserSettings.UserDateOfBirth;
                medioClinicUser.Gender = (Gender)userInfo.UserSettings.UserGender;
                medioClinicUser.City = userInfo.GetStringValue("City", string.Empty);
                medioClinicUser.Street = userInfo.GetStringValue("Street", string.Empty);
                medioClinicUser.Phone = userInfo.UserSettings.UserPhone;
                medioClinicUser.Nationality = userInfo.GetStringValue("Nationality", string.Empty);

                return medioClinicUser;
            }

            return null;
        }

        public static UserInfo ToUserInfo(this MedioClinicUser user)
        {
            var userInfo = new UserInfo();

            UserHelper.UpdateUserInfo(ref userInfo, user);

            return userInfo;
        }
    }
}